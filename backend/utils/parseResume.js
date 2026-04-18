import PDFParser from 'pdf2json';
import fetch from 'node-fetch'; // Ensure you have node-fetch installed
import mammoth from 'mammoth'; // Assuming you have mammoth for DOCX parsing

// Function to extract text from the PDF
const extractTextFromPdf = (pdfBuffer) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1); // Set verbosity to 1 for better error reporting

        // Set timeout to prevent hanging
        const timeout = setTimeout(() => {
            reject(new Error("PDF parsing timeout - took too long to parse"));
        }, 30000); // 30 second timeout

        // Handle errors
        pdfParser.on("pdfParser_dataError", (errData) => {
            clearTimeout(timeout);
            console.error("PDF parsing error:", errData);
            reject(new Error(`Error parsing PDF: ${errData.parserError || JSON.stringify(errData)}`));
        });

        // When parsing is done, extract the text content
        pdfParser.on("pdfParser_dataReady", (pdfData) => {
            try {
                clearTimeout(timeout);
                
                // Try multiple methods to extract text
                let textContent = '';
                
                // Method 1: Try getRawTextContent()
                try {
                    textContent = pdfParser.getRawTextContent();
                    console.log(`Method 1 (getRawTextContent): ${textContent ? textContent.length : 0} characters`);
                } catch (e) {
                    console.log("getRawTextContent() failed:", e.message);
                }
                
                // Method 2: If method 1 fails, try to extract from Pages
                if (!textContent || textContent.trim().length === 0) {
                    try {
                        if (pdfData && pdfData.Pages) {
                            const pages = pdfData.Pages;
                            const extractedTexts = [];
                            
                            pages.forEach((page, pageIndex) => {
                                if (page.Texts) {
                                    page.Texts.forEach((textObj) => {
                                        if (textObj.R) {
                                            textObj.R.forEach((r) => {
                                                if (r.T) {
                                                    // Decode URI-encoded text
                                                    try {
                                                        extractedTexts.push(decodeURIComponent(r.T));
                                                    } catch (e) {
                                                        extractedTexts.push(r.T);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                            
                            textContent = extractedTexts.join(' ');
                            console.log(`Method 2 (Pages extraction): ${textContent ? textContent.length : 0} characters`);
                        }
                    } catch (e) {
                        console.log("Pages extraction failed:", e.message);
                    }
                }
                
                // Method 3: Try to extract from FormFields
                if (!textContent || textContent.trim().length === 0) {
                    try {
                        if (pdfData && pdfData.FormFields) {
                            const formFields = pdfData.FormFields;
                            const fieldTexts = Object.values(formFields).map(field => field.value || '').filter(Boolean);
                            textContent = fieldTexts.join(' ');
                            console.log(`Method 3 (FormFields extraction): ${textContent ? textContent.length : 0} characters`);
                        }
                    } catch (e) {
                        console.log("FormFields extraction failed:", e.message);
                    }
                }
                
                if (!textContent || textContent.trim().length === 0) {
                    console.warn("All extraction methods returned empty text. PDF might be image-based or corrupted.");
                    console.log("PDF structure keys:", pdfData ? Object.keys(pdfData) : 'No pdfData');
                }
                
                resolve(textContent || ''); // Return empty string if nothing extracted
            } catch (error) {
                clearTimeout(timeout);
                console.error("Error extracting text from PDF data:", error);
                reject(error);
            }
        });

        // Load the PDF from buffer (not file path)
        try {
            pdfParser.parseBuffer(pdfBuffer);
        } catch (error) {
            clearTimeout(timeout);
            reject(new Error(`Failed to parse PDF buffer: ${error.message}`));
        }
    });
};

// Function to fetch and parse resumes
const fetchResumeText = async (resumeUrl, originalFilename = null) => {
    try {
        if (!resumeUrl || typeof resumeUrl !== 'string') {
            console.log("Resume URL is missing or invalid");
            return "";
        }

        console.log("Fetching resume from URL:", resumeUrl);
        if (originalFilename) {
            console.log("Original filename:", originalFilename);
        }

        // Determine file type - prioritize original filename, then URL
        let fileType = '';
        
        // First, try to get file type from original filename if available
        if (originalFilename) {
            const filenameParts = originalFilename.split('.');
            if (filenameParts.length > 1) {
                const ext = filenameParts.pop().toLowerCase();
                if (ext === 'pdf' || ext === 'docx') {
                    fileType = ext;
                }
            }
        }
        
        // If not found from filename, try to extract from URL
        if (!fileType) {
            // Remove query parameters first
            const urlWithoutQuery = resumeUrl.split('?')[0];
            // Extract file extension
            const urlParts = urlWithoutQuery.split('.');
            fileType = urlParts.length > 1 ? urlParts.pop().toLowerCase() : '';
        }
        
        // Handle Cloudinary URLs which might have format in path or use default format
        if (!fileType || (fileType !== 'pdf' && fileType !== 'docx')) {
            // Check if it's a Cloudinary URL and try to extract format from path
            if (resumeUrl.includes('cloudinary.com')) {
                // Cloudinary URLs might have format in the path: /upload/v123/.../file.pdf
                const match = resumeUrl.match(/\.(pdf|docx)(\?|$)/i);
                if (match) {
                    fileType = match[1].toLowerCase();
                } else {
                    // For Cloudinary, default to PDF if format is not found
                    // This is safe since upload config specifies format: "pdf"
                    console.log("Could not determine file type from Cloudinary URL, defaulting to PDF");
                    fileType = 'pdf';
                }
            } else {
                console.log("Unsupported file type:", fileType || 'unknown');
                return ""; // Unsupported type; skip
            }
        }

        // Fix Cloudinary URL if it's using /image/upload/ instead of /raw/upload/
        // This is important because resumes should be fetched as raw files, not images
        let fetchUrl = resumeUrl;
        if (resumeUrl.includes('cloudinary.com') && resumeUrl.includes('/image/upload/')) {
            fetchUrl = resumeUrl.replace('/image/upload/', '/raw/upload/');
            console.log("Fixed Cloudinary URL from image to raw:", fetchUrl);
        }
        
        // Fetch the file as a buffer
        const response = await fetch(fetchUrl);
        if (!response || !response.ok) {
            console.error("Failed to fetch resume:", response?.status, response?.statusText);
            return "";
        }
        
        // If file type still not determined, try to get it from Content-Type header
        if (!fileType || (fileType !== 'pdf' && fileType !== 'docx')) {
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/pdf')) {
                fileType = 'pdf';
            } else if (contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') || contentType.includes('application/msword')) {
                fileType = 'docx';
            } else if (resumeUrl.includes('cloudinary.com')) {
                // Final fallback for Cloudinary URLs - default to PDF
                console.log("Could not determine file type from headers, defaulting to PDF for Cloudinary URL");
                fileType = 'pdf';
            } else {
                console.log("Could not determine file type, skipping resume parsing");
                return "";
            }
        }
        
        console.log("Detected file type:", fileType);
        
        const buffer = await response.arrayBuffer();
        if (!buffer || buffer.byteLength === 0) {
            console.error("Empty buffer received from resume URL");
            return "";
        }
        
        const fileBuffer = Buffer.from(buffer);
        console.log(`Fetched resume buffer size: ${fileBuffer.length} bytes`);

        let resumeText = "";

        if (fileType === "pdf") {
            // Parse PDF with custom rendering
            console.log("Parsing PDF resume...");
            resumeText = await extractTextFromPdf(fileBuffer);
            console.log(`Extracted ${resumeText.length} characters from PDF`);
        } else if (fileType === "docx") {
            // Parse DOCX
            console.log("Parsing DOCX resume...");
            const docxData = await mammoth.extractRawText({ buffer: fileBuffer });
            resumeText = docxData.value; // Extracted text from DOCX
            console.log(`Extracted ${resumeText.length} characters from DOCX`);
        }

        const result = typeof resumeText === 'string' ? resumeText : "";
        if (!result || result.trim().length === 0) {
            console.warn("No text extracted from resume");
        }
        return result;

    } catch (error) {
        console.error("Error fetching or parsing resume text:", error.message);
        console.error("Error stack:", error.stack);
        return ""; // Return empty string if parsing fails
    }
};

export { fetchResumeText };
