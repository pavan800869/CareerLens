import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Backgrounds and borders
    content = content.replace('bg-[#12151F]', 'bg-card')
    content = content.replace('bg-[#0D0F1A]', 'bg-background')
    content = content.replace('border-white/10', 'border-border')
    content = content.replace('border-white/20', 'border-border')
    content = content.replace('border-white/5', 'border-border')
    
    # Text colors
    content = content.replace('text-slate-200', 'text-foreground')
    content = content.replace('text-slate-300', 'text-muted-foreground')
    content = content.replace('text-slate-400', 'text-muted-foreground')
    content = content.replace('text-gray-300', 'text-muted-foreground')
    content = content.replace('text-gray-400', 'text-muted-foreground')

    # Accent backgrounds (like hover states or small badges)
    content = content.replace('bg-white/5', 'bg-accent')
    content = content.replace('bg-white/10', 'bg-secondary')
    content = content.replace('bg-black/50', 'bg-secondary/50')
    content = content.replace('bg-black', 'bg-background')

    # Only replace text-white if it is NOT part of a gradient-btn or a colored background
    # Actually, a simpler approach: replace "text-white" with "dark:text-white text-slate-900" 
    # but that might break colored buttons.
    # Let's replace `text-white` with `text-foreground`, and we'll fix up gradient-btn in index.css.
    
    # Let's use regex to find text-white and replace with text-foreground, EXCEPT if it's right after 'gradient-btn '
    # Actually, it's safer to just do simple string replacements, then test the UI.
    content = content.replace('text-white', 'text-foreground')
    
    # If the file had text-foreground inside a gradient-btn, revert it:
    content = content.replace('gradient-btn text-foreground', 'gradient-btn text-white')
    content = content.replace('bg-neon-purple text-foreground', 'bg-neon-purple text-white')
    content = content.replace('bg-emerald-500 hover:bg-emerald-600 text-foreground', 'bg-emerald-500 hover:bg-emerald-600 text-white')
    content = content.replace('bg-red-500 hover:bg-red-600 text-foreground', 'bg-red-500 hover:bg-red-600 text-white')
    content = content.replace('bg-blue-600 text-foreground', 'bg-blue-600 text-white')
    content = content.replace('bg-red-600 text-foreground', 'bg-red-600 text-white')
    content = content.replace('bg-green-600 text-foreground', 'bg-green-600 text-white')
    content = content.replace('bg-black text-foreground', 'bg-black text-white')

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

def main():
    target_dir = '/Users/pavankumar/Documents/Programming/CareerLens/frontend/src'
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js'):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
