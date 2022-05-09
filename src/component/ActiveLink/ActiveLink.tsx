import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import React, { Children, FC, ReactChild, ReactNode } from 'react';

type ActiveLinkProps = {
  activeClassName: string;
  children?: JSX.Element | JSX.Element[];
  href: string;
  as?: string;
};

const ActiveLink: FC<ActiveLinkProps> = ({
  children,
  activeClassName,
  ...props
}) => {
  const { asPath } = useRouter();
  const child = Children.only(children) as JSX.Element;
  const childClassName = child.props.className || '';

  const className =
    asPath === props.href || asPath === props.as
      ? `${childClassName} ${activeClassName}`.trim()
      : childClassName;

  return (
    <Link {...props}>
      {React.cloneElement(child, { className: className || null })}
    </Link>
  );
};

ActiveLink.propTypes = {
  activeClassName: PropTypes.string.isRequired,
};

export default ActiveLink;
