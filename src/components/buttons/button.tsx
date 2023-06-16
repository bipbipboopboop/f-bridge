interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme: "orange" | "green" | "yellow";
}

const Button = (props: ButtonProps) => {
  const {theme, ...buttonProps} = props;
  const className = `${props.className} btn-${theme}`;
  return <button className={className} {...buttonProps} />;
};

export default Button;
