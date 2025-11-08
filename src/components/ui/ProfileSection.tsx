import Image from 'next/image';
import { ProfileSectionProps } from '@/types';

export default function ProfileSection({
  profile,
  showBio = true,
  showLocation = true,
  className = ''
}: ProfileSectionProps) {
  return (
    <section 
      className={`flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 md:gap-8 ${className}`}
      aria-labelledby="profile-heading"
    >
      {/* Profile Information */}
      <div className="flex-1 text-center md:text-left">
        {/* Name */}
        <h1 
          id="profile-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2"
        >
          {profile.name}
        </h1>
        
        {/* English Name */}
        {profile.nameEn && (
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
            <span className="sr-only">英語名: </span>
            {profile.nameEn}
          </p>
        )}

        {/* Current Position and Affiliation */}
        <div className="mb-3 sm:mb-4">
          <p className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">
            {profile.currentPosition}
          </p>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
            {profile.currentAffiliation}
          </p>
        </div>

        {/* Location */}
        {showLocation && profile.location && (
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 flex items-center justify-center md:justify-start gap-2">
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
          <div className="prose prose-gray max-w-none">
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}
      </div>


    </section>
  );
}