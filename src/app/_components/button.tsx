import Link from 'next/link';

export function Button({ children, href, type, onClick, ...props }: { children: React.ReactNode, type?: string, href?: string, onClick?: () => void }) {
    return (
        <div className={"inline-flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 cursor-pointer" +
            (!type || type == "primary" ? " text-white bg-pink-500 hover:bg-pink-600 focus:ring-pink-300 border-pink-300 rounded-full" : "") +
            (type == "secondary" ? " text-white bg-pink-300 hover:bg-pink-400 focus:ring-pink-200 border-2 border-pink-500 rounded-full" : "")}
            onClick={onClick}
            {...props}
        >
            {href ? (<Link href={href}>{children}</Link>) : children}
        </div>
    )
}