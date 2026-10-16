import logo from '../assets/srmcemlogo.png';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-700 bg-[#111827] text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SRMCEM" className="size-9 rounded-xl bg-white object-contain p-1" />
          <div>
            <p className="text-sm font-semibold text-white">SRMCEM Placement Portal</p>
            <p className="mt-1 text-xs text-slate-400">&copy; {year} SRMCEM Placement Portal. All rights reserved.</p>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
