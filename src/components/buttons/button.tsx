interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme: "primary" | "secondary" | "tertiary";
}

const Button = (props: ButtonProps) => {
  const {theme, ...buttonProps} = props;
  const className = `${props.className} btn-${theme}`;
  return (
    <button className={className} {...buttonProps}>
      button
    </button>
  );
};

export default Button;
