import { AuthBannerProp } from '../../interfaces';

const AuthBanner = ({ animate }: AuthBannerProp) => (
  <div
    className={`flex-1 relative hidden items-center justify-center bg-gray-900 lg:flex h-screen transition-transform duration-1000 transform ${
      animate ? 'translate-x-0' : 'translate-x-full'
    }`}
  >
    <div className="relative z-10 w-full max-w-md">
      <img src="farna-logo.png" alt="farna logo" width={150} />
      <div className=" mt-16 space-y-3">
        <h3 className="text-white text-3xl font-bold">WE ARE FARNA TEXTILES</h3>
        <p className="text-gray-300">
          Farna is not a name, it’s a vision, encapsulating excellence and
          brilliance in the Textiles Industry of Pakistan.
        </p>
        <div className="flex items-center -space-x-2 overflow-hidden">
          <p className="text-sm text-gray-400 font-medium translate-x-5">
            Dealing with high-end tech fibers since 2006
          </p>
        </div>
      </div>
    </div>
    <div
      className="absolute inset-0 my-auto h-[500px]"
      style={{
        background:
          'linear-gradient(152.92deg, rgb(78,183,246) 4.54%, rgba(192, 132, 252, 0.1) 34.2%, rgb(10,36,51) 77.55%)',
        filter: 'blur(118px)',
      }}
    />
  </div>
);

export default AuthBanner;
