import { SocialLinksProps, SocialLink } from '@/types';

// Platform icon components
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const ORCIDIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947 0 .525-.422.947-.947.947-.525 0-.946-.422-.946-.947 0-.525.421-.947.946-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 3.588-1.444 3.588-3.722 0-2.016-1.091-3.722-3.588-3.722h-2.297z"/>
  </svg>
);

const ResearchGateIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19.586 0H4.414C1.977 0 0 1.977 0 4.414v15.172C0 22.023 1.977 24 4.414 24h15.172C22.023 24 24 22.023 24 19.586V4.414C24 1.977 22.023 0 19.586 0zM8.063 18.411c-1.538 0-2.785-1.247-2.785-2.785s1.247-2.785 2.785-2.785 2.785 1.247 2.785 2.785-1.247 2.785-2.785 2.785zm7.875-3.75c-.938 0-1.688-.75-1.688-1.688s.75-1.688 1.688-1.688 1.688.75 1.688 1.688-.75 1.688-1.688 1.688z"/>
  </svg>
);

const EmailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const WebsiteIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

// Platform configuration
const platformConfig = {
  twitter: {
    name: 'Twitter',
    icon: TwitterIcon,
    color: 'hover:text-blue-500'
  },
  github: {
    name: 'GitHub',
    icon: GitHubIcon,
    color: 'hover:text-gray-900'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: LinkedInIcon,
    color: 'hover:text-blue-600'
  },
  orcid: {
    name: 'ORCID',
    icon: ORCIDIcon,
    color: 'hover:text-green-600'
  },
  researchgate: {
    name: 'ResearchGate',
    icon: ResearchGateIcon,
    color: 'hover:text-teal-600'
  },
  email: {
    name: 'Email',
    icon: EmailIcon,
    color: 'hover:text-red-500'
  },
  website: {
    name: 'Website',
    icon: WebsiteIcon,
    color: 'hover:text-purple-600'
  }
};

function SocialLinkItem({ 
  link, 
  showLabel, 
  orientation 
}: { 
  link: SocialLink; 
  showLabel: boolean; 
  orientation: 'horizontal' | 'vertical';
}) {
  const config = platformConfig[link.platform];
  const IconComponent = config.icon;
  
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center gap-2 p-2 rounded-lg
        text-gray-600 ${config.color}
        transition-colors duration-200
        hover:bg-gray-50
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${orientation === 'vertical' ? 'w-full justify-start' : 'justify-center'}
      `}
      aria-label={`${config.name}で${link.username || 'プロフィール'}を見る`}
    >
      <IconComponent className="w-5 h-5 flex-shrink-0" />
      {showLabel && (
        <span className="text-sm font-medium">
          {link.username || config.name}
        </span>
      )}
    </a>
  );
}

export default function SocialLinks({
  socialLinks,
  showLabels = false,
  orientation = 'horizontal',
  className = ''
}: SocialLinksProps) {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  return (
    <div 
      className={`
        ${orientation === 'horizontal' 
          ? 'flex flex-wrap items-center justify-center md:justify-start gap-2' 
          : 'flex flex-col gap-1'
        }
        ${className}
      `}
      role="list"
      aria-label="ソーシャルメディアリンク"
    >
      {socialLinks.map((link) => (
        <div key={link.id} role="listitem">
          <SocialLinkItem 
            link={link} 
            showLabel={showLabels} 
            orientation={orientation}
          />
        </div>
      ))}
    </div>
  );
}