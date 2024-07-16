import Link from 'next/link';

export function Button({ children, href, type, onClick, ...props }: { children: React.ReactNode, type?: string, href?: string, onClick?: () => void }) {
    return (
        <div className={"inline-flex items-center py-2 px-4 border-transparent rounded-md text-sm font-medium focus:outline-none cursor-pointer" +
            (!type || type == "primary" ? " text-white bg-pink-500 hover:bg-pink-600 rounded-full" : "") +
            (type == "secondary" ? " text-white bg-pink-300 hover:bg-pink-400 rounded-full" : "")}
            onClick={onClick}
            {...props}
        >
            {href ? (<Link href={href}>{children}</Link>) : children}
        </div>
    )
}