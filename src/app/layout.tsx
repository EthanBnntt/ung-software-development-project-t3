import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import { Navbar } from "~/app/_components/navbar";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
	title: "BookReviewHub",
	description: "BookReviewHub, a hub for book reviews",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const session = await getServerSession();

	return (
		<html lang="en" className={`${GeistSans.variable}`}>
			<body>
				<TRPCReactProvider>
					<Navbar isLoggedIn={session?.user != null}></Navbar>
					<main className="container mx-auto bg-white">
						{children}
					</main>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
