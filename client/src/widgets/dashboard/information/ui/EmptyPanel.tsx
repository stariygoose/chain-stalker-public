import { LogoIcon } from "@/shared/assets";

export const EmptyPanel = () => {
	return (
		<div className="border max-lg:hidden flex flex-col bg-color-second w-1/3 rounded-2xl
		justify-center p-5 items-center mt-4">
			<LogoIcon width={150} height={150}/>
			<div className="text-center text-3xl font-extrabold">
				Any Item Selected
			</div>
		</div>
	);
}