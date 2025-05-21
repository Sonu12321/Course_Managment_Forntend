import React, { useState, useEffect, useRef } from 'react';
import img1 from '../../public/Rotate/one.webp';
import img2 from '../../public/Rotate/two.webp';
import img3 from '../../public/Rotate/three.webp';
import img4 from '../../public/Rotate/four.webp';
import img5 from '../../public/Rotate/five.webp';
import img6 from '../../public/Rotate/six.webp';
import img7 from '../../public/Rotate/seven.webp';
import img8 from '../../public/Rotate/eight.webp';
import img9 from '../../public/Rotate/nine.webp';
// import img2 from '../public/Rotate/two.webp';
// import img3 from '../public/Rotate/three.webp';
// import img4 from '../public/Rotate/four.webp';
// import img5 from '../public/Rotate/five.webp';
// import img6 from '../public/Rotate/six.webp';
// import img7 from '../public/Rotate/seven.webp';
// import img8 from '../public/Rotate/eight.webp';
// import img9 from '../public/Rotate/nine.webp';

export default function Rotation() {
  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

  const courseTitles = [
    "Full-Stack Web Development",
    "UI/UX Design Fundamentals",
    "Python for Data Science",
    "Machine Learning with Python",
    "React & Redux Bootcamp",
    "Cybersecurity Essentials",
    "Cloud Computing with AWS",
    "Digital Marketing Strategy",
    "Blockchain Basics"
  ];

  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const carouselRef = useRef(null);

  const handleScroll = () => {
    if (!carouselRef.current || isHovered || isTouching) return;

    const container = carouselRef.current;
    const scrollWidth = container.scrollWidth;
    const containerWidth = container.clientWidth;

    if (container.scrollLeft >= scrollWidth / 2 - containerWidth) {
      container.scrollTo({ left: 0, behavior: 'auto' });
    } else {
      container.scrollBy({ left: 3, behavior: 'auto' });
    }
  };

  useEffect(() => {
    const interval = setInterval(handleScroll, 15);
    return () => clearInterval(interval);
  }, [isHovered, isTouching]);

  const renderCard = (image, index) => (
    <div
      key={index}
      className="relative flex-shrink-0 w-74 h-[480px] bg-white rounded-2xl shadow-md overflow-hidden 
                 flex flex-col border border-gray-200 transition-transform duration-300 hover:scale-105 hover:shadow-2xl mx-4 my-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsTouching(true)}
      onTouchEnd={() => setIsTouching(false)}
    >
      {/* Image */}
      <div className="w-full h-4/5 relative overflow-hidden">
        <img
          src={image}
          alt={`Course ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-2 flex-col justify-between ">
        <div>
          <h3 className="text-xl font-semibold text-center  text-gray-800 mb-3">
            {courseTitles[index % courseTitles.length]}
          </h3>
          
          <div className="flex items-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.293c.3.92-.755 1.688-1.54 1.118L10 13.348l-2.8 2.034c-.784.57-1.838-.197-1.54-1.118l1.07-3.293a1 1 0 00-.364-1.118L3.566 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        
      </div>

      {/* Ad badge */}
        
    </div>
  );

  return (
    <>
      <div className="w-full bg-gradient-to-b from-blue-200 to-white py-8">
        <h2 className="text-5xl font-bold text-center mb-8">Featured Courses</h2>

        <div className="relative overflow-hidden w-full">
          <div className="flex items-center justify-center w-full py-4">
            <div
              ref={carouselRef}
              className="flex items-center overflow-x-auto hide-scrollbar w-full h-[520px]"
              style={{
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingTop: '10px',
                paddingBottom: '10px'
              }}
            >
              {/* Multiple copies for infinite loop */}
              {[...Array(3)].flatMap((_, i) =>
                images.map((img, idx) => renderCard(img, idx + i * images.length))
              )}
            </div>
          </div>

          {/* Remove glowing side gradients as requested */}
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
