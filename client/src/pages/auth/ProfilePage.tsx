import { Card, Tabs, TabsProps } from "antd";
import CoverPicture from "../../components/profile/CoverPicture";
import ProfileImage from "../../components/profile/ProfileImage";
import ResetPasswordFrom from "../../components/profile/ResetPasswordFrom";

const ProfilePage = ({ user }: { user: any }) => {
  console.log(user, "user");
  const items: TabsProps["items"] = [
    {
      key: "3",
      label: "Password",
      children: <ResetPasswordFrom />,
    },
  ];

  return (
    <>
      <div className="md:p-4">
        <div className="lg:max-w-6xl mx-auto h-40 md:h-72 rounded-3xl relative">
          <CoverPicture user={user} />
          <ProfileImage user={user} />
        </div>

        {/* ?body section */}
        <div className="mt-10 md:p-4 p-1 bg-gray-100 rounded-lg lg:max-w-6xl mx-auto">
          <Card
            bordered={false}
            className="shadow-md mt-10"
            color="#f5ffff"
            title={
              <div className="py-4">
                <h1 className="text-2xl sm:text-4xl font-medium text-balance">
                  {user?.name}
                  <span className="text-lg sm:text-xl text-gray-600">
                    &nbsp;(Developed by AmberAliza)
                  </span>
                </h1>
                <h1 className="mt-2 sm:text-xl text-lg text-balance">
                  Full Stack Developers
                </h1>
              </div>
            }
          >
            <Tabs defaultActiveKey="1" items={items} />
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
