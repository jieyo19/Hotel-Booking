import React from 'react';
import Title from './Title';
import { testimonials } from '../assets/assets';
import StarRating from './StarRating';

const Testimonial = () => {
  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-30'>
      <Title 
        title="What Our Guests Say" 
        subTitle="Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world."
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 w-full'>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className='bg-white p-8 rounded-lg shadow-sm'>
            <div className='flex items-center gap-4 mb-4'>
              <img 
                src={testimonial.image} 
                alt={testimonial.name} 
                className='w-16 h-16 rounded-full object-cover'
              />
              <div>
                <h3 className='font-medium text-lg'>{testimonial.name}</h3>
                <p className='text-sm text-gray-500'>{testimonial.address}</p>
              </div>
            </div>

            <div className='flex gap-1 mb-4'>
              <StarRating rating={testimonial.rating} />
            </div>

            <p className='text-gray-600 text-sm leading-relaxed'>
              "{testimonial.review}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;