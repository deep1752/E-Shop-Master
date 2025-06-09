'use client'; 

import { useForm } from 'react-hook-form'; // For form handling and validation
import { toast } from 'sonner'; 
import { useRouter } from 'next/navigation'; 

export default function ContactPage() {
  const router = useRouter(); // Used for redirecting after successful form submission

  
  const {
    register,       // Used to register form inputs
    handleSubmit,   // Handles the form submission
    reset,          // Resets form fields
    formState: { errors }, // Tracks validation errors
  } = useForm();

  // Function triggered on form submission
  const onSubmit = async (data) => {
    try {
      // Send form data to FastAPI backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // Convert form data to JSON
      });

      // Handle success response
      if (res.ok) {
        toast.success('Message sent successfully!'); 
        reset(); // Clear the form fields

        // Redirect to homepage after 1 seconds delay
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        // If API sends back an error message
        const result = await res.json();
        toast.error(result.detail || 'Error occurred'); // Show error toast
      }
    } catch (err) {
      // If fetch fails due to server/network issues
      toast.error('Server error'); // Show generic error toast
    }
  };

  // UI Rendering
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>

  
      <form onSubmit={handleSubmit(onSubmit)} className="contact-form">

        {/* Name input */}
        <input
          type="text"
          placeholder="Your Name"
          {...register('name', { required: true })} // Required validation
          className="contact-input"
        />
        {errors.name && <p className="contact-error">Name is required</p>} {/* Error message */}

        {/* Email input */}
        <input
          type="email"
          placeholder="Your Email"
          {...register('email', { required: true })} // Required validation
          className="contact-input"
        />
        {errors.email && <p className="contact-error">Email is required</p>} {/* Error message */}

        {/* Message textarea */}
        <textarea
          placeholder="Your Message"
          {...register('message', { required: true })} // Required validation
          className="contact-textarea"
          rows="5"
        ></textarea>
        {errors.message && <p className="contact-error">Message is required</p>} {/* Error message */}

        {/* Submit button */}
        <button type="submit" className="contact-button">
          Send Message
        </button>
      </form>
    </div>
  );
}
