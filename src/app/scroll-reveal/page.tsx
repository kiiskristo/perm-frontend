import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simple Scroll Reveal',
  description: 'Scroll reveal animation demo',
};

export default function ScrollRevealPage() {
  return (
    <>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background: transparent;
          font-family: 'Georgia', serif;
          min-height: 100vh;
          overflow-x: hidden;
        }
        
        .page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 0;
          margin: 0;
        }

        .scroll-container {
          position: relative;
          width: 95vw;
          height: min(90vh, 750px);
          max-width: 1200px;
        }

        /* Visible window for the paper */
        .paper-window {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 450px;
          height: 0px;
          overflow: hidden;
          animation: expandWindow 3s ease-out forwards;
        }

        /* The actual paper content */
        .paper-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 450px;
          height: 675px;
          background: linear-gradient(45deg, #F5F5DC 0%, #FFFEF7 50%, #F5F5DC 100%);
          border: 3px solid #D4AF37;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: #5D4037;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .paper-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 24px,
              rgba(139, 69, 19, 0.1) 25px
            );
          border-radius: 7px;
        }

        .paper-content h1 {
          margin: 0 0 20px 0;
          font-size: 32px;
          font-weight: bold;
          z-index: 1;
          position: relative;
        }

        .paper-content p {
          margin: 5px 0;
          font-size: 18px;
          z-index: 1;
          position: relative;
        }

        .paper-content .subtitle {
          font-style: italic;
          color: #6D4C41;
          margin-bottom: 15px;
        }

        /* Top stick */
        .stick-left {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -60px);
          width: 500px;
          height: 60px;
          background: linear-gradient(0deg, #8B4513, #A0522D, #654321, #A0522D, #8B4513);
          border-radius: 30px;
          z-index: 10;
          animation: stickTop 3s ease-out forwards;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
        }

        /* Bottom stick */
        .stick-right {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, 0px);
          width: 500px;
          height: 60px;
          background: linear-gradient(0deg, #8B4513, #A0522D, #654321, #A0522D, #8B4513);
          border-radius: 30px;
          z-index: 10;
          animation: stickBottom 3s ease-out forwards;
          box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.4);
        }

        /* Wood grain */
        .stick-left::before,
        .stick-right::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              rgba(0, 0, 0, 0.1) 2px,
              transparent 4px
            );
          border-radius: 30px;
        }

        @keyframes expandWindow {
          0% {
            height: 0px;
          }
          100% {
            height: 600px;
          }
        }

        @keyframes stickTop {
          0% {
            transform: translate(-50%, -60px);
          }
          100% {
            transform: translate(-50%, -367px);
          }
        }

        @keyframes stickBottom {
          0% {
            transform: translate(-50%, 0px);
          }
          100% {
            transform: translate(-50%, 307px);
          }
        }

        /* Mobile responsiveness - Full width */
        @media (max-width: 768px) {
          .scroll-container {
            width: 95vw;
            height: min(90vh, 450px);
          }
          
          .paper-window {
            width: 280px;
            height: 0px;
            animation: expandWindow 3s ease-out forwards;
          }
          
          .paper-content {
            width: 280px;
            height: 420px;
          }
          
          /* Top stick (mobile) */
          .stick-left {
            width: 320px;
            height: 50px;
            transform: translate(-50%, -50px);
            animation: stickTopMobile 3s ease-out forwards;
            background: linear-gradient(0deg, #8B4513, #A0522D, #654321, #A0522D, #8B4513);
            border-radius: 25px;
          }
          
          /* Bottom stick (mobile) */
          .stick-right {
            width: 320px;
            height: 50px;
            transform: translate(-50%, 0px);
            animation: stickBottomMobile 3s ease-out forwards;
            background: linear-gradient(0deg, #8B4513, #A0522D, #654321, #A0522D, #8B4513);
            border-radius: 25px;
          }
          
          .stick-left::before,
          .stick-right::before {
            background-image: 
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                rgba(0, 0, 0, 0.1) 2px,
                transparent 4px
              );
            border-radius: 25px;
          }
          
          @keyframes stickTopMobile {
            0% {
              transform: translate(-50%, -50px);
            }
            100% {
              transform: translate(-50%, -235px);
            }
          }

          @keyframes stickBottomMobile {
            0% {
              transform: translate(-50%, 0px);
            }
            100% {
              transform: translate(-50%, 185px);
            }
          }
        }
      `}</style>
      
      <div className="page-container">
        <div className="scroll-container" id="animationContainer">
          <div className="paper-window">
            <div className="paper-content">
              <img 
                src="/INVITE.jpg" 
                alt="Invitation" 
                style={{
                  maxWidth: '90%', 
                  maxHeight: '90%', 
                  objectFit: 'contain', 
                  borderRadius: '5px'
                }}
              />
            </div>
          </div>
          <div className="stick-left"></div>
          <div className="stick-right"></div>
        </div>
      </div>
    </>
  );
}