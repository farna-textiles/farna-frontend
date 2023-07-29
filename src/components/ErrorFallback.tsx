// If something goes wrong with lazy loading, fall back to this component

const ErrorFallback = () => {
  return <section className="flex items-center h-full p-16">
	<div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
		<div className="max-w-md text-center text-gray-500">
			<h2 className="mb-8 font-extrabold text-9xl text-[#61b5ff]">
				ERROR
			</h2>
			<p className="text-2xl font-semibold md:text-3xl">Sorry, something went wrong.</p>
			<p className="mt-4 mb-8 dark:text-gray-400">Please refresh or try again later.</p>
		</div>
	</div>
</section>
};

export default ErrorFallback;
