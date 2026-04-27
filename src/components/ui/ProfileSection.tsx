import Image from 'next/image';
import { ProfileSectionProps } from '@/types';

export default function ProfileSection({
  profile,
  showBio = true,
  showLocation = true,
  className = ''
}: ProfileSectionProps) {
  const avatarSrc = profile.avatarUrl || '/images/avatar.jpg';

  return (
    <section
      className={`flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 ${className}`}
      aria-labelledby="profile-heading"
    >
      <div className="relative h-32 w-32 sm:h-40 sm:w-40 md:h-44 md:w-44 overflow-hidden rounded-3xl border border-gray-200/80 dark:border-gray-700/80 bg-gray-100 dark:bg-gray-800 shadow-soft">
        <Image
          src={avatarSrc}
          alt={`${profile.name}のプロフィール写真`}
          fill
          priority
          sizes="(max-width: 768px) 128px, 176px"
          className="object-cover"
        />
      </div>

      {/* Profile Information */}
      <div className="flex-1 text-center md:text-left">
        {/* Name */}
        <h1
          id="profile-heading"
          aria-label={profile.name}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 flex flex-wrap items-baseline justify-center md:justify-start gap-x-3 gap-y-1"
        >
          <span>{profile.name}</span>
          {profile.nameEn && (
            <span
              aria-hidden="true"
              className="text-base sm:text-lg font-normal text-gray-600 dark:text-gray-400"
            >
              {profile.nameEn}
            </span>
          )}
        </h1>

        {/* Current Affiliation */}
        <div className={showBio ? 'mb-3 sm:mb-4' : 'mb-1 sm:mb-1'}>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
            {profile.currentAffiliation}
          </p>
        </div>

        {/* Location */}
        {showLocation && profile.location && (
          <p
            className={`text-sm sm:text-base text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 ${showBio ? 'mb-3 sm:mb-4' : 'mb-1 sm:mb-1'}`}
          >
            <svg 
              className="w-4 h-4 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
            <span>
              <span className="sr-only">所在地: </span>
              {profile.location}
            </span>
          </p>
        )}

        {/* Bio */}
        {showBio && profile.bio && (
          <div className="max-w-none">
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
