import { type PropsWithChildren } from "react";

const PageLayout = (props: PropsWithChildren) => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">{props.children}</div>
  );
};

export default PageLayout;
