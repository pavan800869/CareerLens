import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
    useEffect(()=>{
        const filteredCompany = companies.length >= 0 && companies.filter((company)=>{
            if(!searchCompanyByText){
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());

        });
        setFilterCompany(filteredCompany);
    },[companies,searchCompanyByText])
    return (
        <div className='overflow-x-auto'>
            <Table>
                <TableCaption className="text-slate-500 text-xs">A list of your registered companies</TableCaption>
                <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground text-xs font-medium">Logo</TableHead>
                        <TableHead className="text-muted-foreground text-xs font-medium">Name</TableHead>
                        <TableHead className="text-muted-foreground text-xs font-medium">Date</TableHead>
                        <TableHead className="text-right text-muted-foreground text-xs font-medium">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.map((company) => (
                            <TableRow key={company._id} className="border-border hover:bg-white/[0.02]">
                                <TableCell>
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={company.logo}/>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="text-foreground text-sm">{company.name}</TableCell>
                                <TableCell className="text-muted-foreground text-xs">{company.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal className='text-muted-foreground hover:text-foreground transition-colors w-4 h-4' />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 glass border-border rounded-lg p-2">
                                            <div onClick={()=> navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-2 w-full cursor-pointer text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-accent transition-colors'>
                                                <Edit2 className='w-3.5 h-3.5' />
                                                <span className='text-sm'>Edit</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>

                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable