import React from 'react';
import Navi from "./components/sellerNav";

const teamMembers = [
  {
    name: 'Jay Nakar',
    title: 'The Code Whisperer 🧙‍♂️',
    description: 'Rumor has it he speaks fluent JavaScript in his sleep!',
    image: "/1000085052 (1) (1).jpg" 
  },
  {
    name: 'Parth Vaja',
    title: 'UX Maestro 🎨',
    description: 'Has a sixth sense for colors that just *work*.',
    image: '/images/parth-vaja.jpg'
  },
  {
    name: 'Kashyap Ambaliya',
    title: 'UX Maestro 🎨',
    description: 'Has a sixth sense for colors that just *work*.',
    image: '/images/parth-vaja.jpg'
  },
];


function AboutUs() {
  return (
    <>
      <Navi />
      <style>{`
        .about-us-container {
          max-width: 1000px;
          margin: 2rem auto;
          padding: 1.5rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
        }
        .AboutUsH {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 0.5rem;
          color: #2c3e50;
        }
        .intro-text {
          text-align: center;
          margin-bottom: 2rem;
          color: #4a4a4a;
        }
        .team-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2rem;
        }
        .card {
          perspective: 1000px;
          cursor: pointer;
        }
        .card-inner {
        position: relative;
        width: 100%;
        min-height: 300px; /* increased to allow more room */
        transition: transform 0.8s;
        transform-style: preserve-3d;
      }

        /* Flip on hover */
        .card:hover .card-inner {
          transform: rotateY(180deg);
        }

        .card-front {
          background-color: #f9f9f9;
        }
        .card-back {
          background-color: #2c3e50;
          color: #fff;
          transform: rotateY(180deg);
        }
        .card-front h3,
        .card-back h3 {
          margin: 0.25rem 0;
          font-size: 1.1rem;
          line-height: 1.2;
        }
        .card-front p,
        .card-back p {
          font-size: 0.9rem;
          line-height: 1.3;
          margin: 0.25rem 0;
          word-break: break-word;
        }
        .closing-text {
          text-align: center;
          margin-top: 2rem;
          color: #5a5a5a;
        }
        .card-face {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        box-sizing: border-box;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        overflow-wrap: break-word;
        overflow-y: auto; /* ✅ allows scrolling if content exceeds card size */
      }


      .card-front img,
      .card-back img {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 0.5rem;
      }

      `}</style>

      <section className="about-us-container">
        <h1 className="AboutUsH">Welcome to Casa di Arté!</h1>
        <p className="intro-text">
          We're a team of passionate creators dedicated to supporting local craftsmanship and bringing you unique, hand-made treasures.
        </p>
        <h2 className="AboutUsH">Meet the Dream Team ✨</h2>
        <section className="team-cards">
          {teamMembers.map(member => (
            <section key={member.name} className="card">
              <section className="card-inner">
                <section className="card-face card-front">
                  <h3>{member.name}</h3>
                  <p>{member.title}</p>
                </section>
                <section className="card-face card-back">
                  <h3>About</h3>
                  <p>{member.description}</p>
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{ width: '80%', borderRadius: '8px', marginTop: '0.5rem' }}
                  />
                </section>
              </section>
            </section>
          ))}
        </section>
        <p className="closing-text">
          We are on a mission to make buying local feel global. Thanks for being part of our journey!
        </p>
      </section>
    </>
  );
}

export default AboutUs;
