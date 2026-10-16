import { useState } from 'react';
import { initialsFor, profileImageUrl as directProfileImageUrl } from '../utils/profile';

export default function ProfileAvatar({ name, email, image, imageUrl = '', loading = false, size = 'h-10 w-10', className = '' }) {
  const directUrl = directProfileImageUrl(image);
  const resolvedUrl = directUrl || imageUrl;
  const [failedSrc, setFailedSrc] = useState('');
  const waitingForImage = loading && !resolvedUrl;
  return <span className={`inline-grid ${size} shrink-0 place-items-center overflow-hidden rounded-full border border-slate-300 bg-slate-100 text-sm font-bold text-[#102747] ${className}`} aria-label={`${name || 'User'} profile avatar`}>
    {waitingForImage
      ? <span className="size-full animate-pulse rounded-full bg-slate-200" aria-hidden="true" />
      : resolvedUrl && failedSrc !== resolvedUrl
        ? <img src={resolvedUrl} alt="" className="size-full rounded-full object-cover" onLoad={() => { if (import.meta.env.DEV) console.debug('[profile-image] browser rendered image successfully', { finalSrc: resolvedUrl }); }} onError={() => { if (import.meta.env.DEV) console.debug('[profile-image] browser failed to render image', { finalSrc: resolvedUrl }); setFailedSrc(resolvedUrl); }} />
        : initialsFor(name, email)}
  </span>;
}
