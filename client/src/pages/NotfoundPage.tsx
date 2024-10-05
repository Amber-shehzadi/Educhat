import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const NotfoundPage = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link to={"/"}>
          <Button type="primary" shape="round">
            Back Home
          </Button>
        </Link>
      }
    />
  );
};

export default NotfoundPage;
