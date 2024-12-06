// src/app/_components/Logo.tsx
const Logo = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row', // Align items in a row
      justifyContent: 'center',
      alignItems: 'center', // Center items vertically
      textAlign: 'center',
      color: '#FFF',
      textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="98"
        height="133"
        viewBox="0 0 98 133"
        fill="none"
      >
        <g filter="url(#filter0_d_4504_5)">
          <rect x="4" y="43" width="72" height="13" rx="6.5" fill="white" />
          <rect x="4.5" y="43.5" width="71" height="12" rx="6" stroke="white" />
        </g>
        <rect x="70.5" y="43.5" width="27" height="12" fill="white" stroke="white" />
        <line x1="71.9741" y1="54.5458" x2="79.9741" y2="124.546" stroke="white" strokeWidth="8" />
        <path d="M50.9592 55.2695L60.5 123" stroke="white" strokeWidth="8" />
        <g filter="url(#filter1_d_4504_5)">
          <line x1="12.9425" y1="54.3241" x2="24.9425" y2="124.324" stroke="white" strokeWidth="8" />
        </g>
        <line x1="29.9408" y1="55.3146" x2="41.9408" y2="124.315" stroke="white" strokeWidth="8" />
        <g filter="url(#filter2_d_4504_5)">
          <path d="M21 123L89 123" stroke="white" strokeWidth="4" />
        </g>
        <rect x="8" y="14" width="15" height="29" fill="#A33E3E" />
        <rect x="23" y="5" width="15" height="38" fill="#EB9F68" />
        <rect x="38" y="20" width="15" height="23" fill="#F5D575" />
        <rect x="52" y="14" width="15" height="29" fill="#579B3C" />
        <rect x="67" y="0" width="15" height="43" fill="#4163DF" />
        <rect x="82" y="24" width="13" height="19" fill="#C14CA7" />
        <defs>
          <filter id="filter0_d_4504_5" x="0" y="43" width="80" height="21" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4504_5" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4504_5" result="shape" />
          </filter>
          <filter id="filter1_d_4504_5" x="2" y="52.6483" width="27.885" height="79.3517" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dx="-3" dy="3" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4504_5" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4504_5" result="shape" />
          </filter>
          <filter id="filter2_d_4504_5" x="17" y="121" width="76" height="12" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4504_5" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4504_5" result="shape" />
          </filter>
        </defs>
      </svg>
      <div style={{
        fontSize: '100px',
        fontWeight: 600,
        lineHeight: '61px',
      }}>
        <div style={{ marginLeft: '-15px' }}> {/* Move only "class" to the left */}
          <h1 style={{ margin: '0' }}>class</h1>
        </div>
        <h1 style={{ margin: '0', marginTop: '20px' }}>caddy</h1>
      </div>
    </div>
  );
};

export default Logo;