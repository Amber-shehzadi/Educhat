import { Button, Spin, Upload, message } from "antd";
import React, { useEffect } from "react";
import { FaPencil } from "react-icons/fa6";
import CHImage from "../common/CHImage";
import { assignAvaatr } from "../../utils/common";
import { useUpdateProfilePictureMutation } from "../../redux/user/userAPI";
import { useLazyLoadUserQuery } from "../../redux/features/api/apiSlice";
import ImgCrop from "antd-img-crop";
import { Loading3QuartersOutlined } from "@ant-design/icons";

type ProfilePicProps = {
  user: any;
};

const ProfileImage: React.FC<ProfilePicProps> = ({ user }) => {
  const [loadUserdata] = useLazyLoadUserQuery();

  const [messageApi, contextHolder] = message.useMessage();

  const [uploadProfilePicture, { isSuccess, error, isLoading }] =
    useUpdateProfilePictureMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = "Profile picture uploaded successfully";
      messageApi.open({
        type: "success",
        content: message,
      });
      loadUserdata({});
    }
    if (error) {
      if ("data" in error) {
        const errordata: any = error;
        messageApi.open({
          type: "error",
          content: errordata.data.message,
        });
      }
    }
  }, [isSuccess, error, messageApi, loadUserdata]);

  const props = {
    multiple: false,
    showUploadList: false,
    name: "file",
    maxCount: 1,
    customRequest: async ({ file }: { file: any }) => {
      // first convert to base64 then upload
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          const avatar = fileReader.result;
          uploadProfilePicture(avatar);
        }
      };
    },
  };

  return (
    <>
      {contextHolder}
      <div className="absolute border-[4px] border-white h-28 w-28 md:h-40 md:w-40 left-[5%] -bottom-14 md:-bottom-20 rounded-full z-40">
        {isLoading ? (
          <div className="absolute bg-gray-100 h-full w-full z-10 opacity-[0.8] rounded-full flex justify-center items-center">
            <Spin
              indicator={<Loading3QuartersOutlined spin />}
              size="large"
              className="rounded-full"
            />
          </div>
        ) : null}
        <ImgCrop rotationSlider cropShape="round">
          <Upload {...props}>
            <Button
              shape="circle"
              className="absolute z-10 top-1/2 -right-4 "
              icon={<FaPencil />}
              size="small"
            ></Button>
          </Upload>
        </ImgCrop>
        <CHImage
          className="rounded-full"
          src={user?.avatar?.url || assignAvaatr(user?.gender)}
          maskClassName="rounded-full"
        />
      </div>
    </>
  );
};

export default ProfileImage;
