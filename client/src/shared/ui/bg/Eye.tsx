import { useEffect, useState } from "react";
import style from "./Eye.module.css"


export const Eye = () => {
	const [mousePosition, setMousePosition] = useState({ x: 600, y: 400 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = (
		eyeX: number, 
		eyeY: number, 
		pupilRadius: number, 
		eyeRadius: number
	) => {
    const dx = mousePosition.x - eyeX;
    const dy = mousePosition.y - eyeY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance  < eyeRadius - pupilRadius) {
      return { x: dx, y: dy };
    } else {
      const angle = Math.atan2(dy, dx);
      return {
        x: Math.cos(angle) * (eyeRadius - pupilRadius),
        y: Math.sin(angle) * (eyeRadius - pupilRadius),
      };
    }
  };

  // Eye and pupil properties
  const eye = { x: 600, y: 400, radius: 100 };
  const pupilRadius = 20;

  const pupil = calculatePupilPosition(eye.x, eye.y, pupilRadius, eye.radius);

	return (
    <div id={style.background}>
      <svg xmlns="http://www.w3.org/2000/svg"
				id={style.background_svg}>        
        <g>
					{/* Full Eye */}
					<g id={style.eye_group}>
						{/* Eye Outline */}
						<path
							d="M400,400 Q600,250 800,400 Q600,550 400,400 Z"
							strokeWidth="4"
						/>
						{/* Pupil */}
						<circle 
							id={style.eye_pupil}
							cx={eye.x + pupil.x/2}
							cy={eye.y + pupil.y/2}
							r={pupilRadius} />
        	</g>
        </g>
      </svg>
    </div>
	);
}