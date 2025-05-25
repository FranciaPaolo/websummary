import React from "react";
import classNames from 'classnames';


const Avatar = ({ url, alt, className="avatar-container", size="60" }) => {

  const classConfi = classNames({
    [`${className}`]: true,
    [`${className}`]: className,
  })

  return (
    <a href="/#" className={ classNames(classConfi) }>
      <img
        src={ url }
        alt={ alt }
        className="avatar-img"
        width={ size }
        height={ size }
      />
    </a>
  );
};

export default Avatar;
