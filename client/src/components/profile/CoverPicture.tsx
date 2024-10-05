import { Button, Spin, Upload, message } from "antd";
import CHImage from "../common/CHImage";
import { FaPencil } from "react-icons/fa6";
import ImgCrop from "antd-img-crop";
import { useUpdateCoverPictureMutation } from "../../redux/user/userAPI";
import { useLazyLoadUserQuery } from "../../redux/features/api/apiSlice";
import { useEffect } from "react";
import { Loading3QuartersOutlined } from "@ant-design/icons";

const CoverPicture = ({ user }: { user: any }) => {
  const [loadUserdata] = useLazyLoadUserQuery();

  const [messageApi, contextHolder] = message.useMessage();

  const [uploadProfilePicture, { isSuccess, error, isLoading }] =
    useUpdateCoverPictureMutation();

  useEffect(() => {
    if (isSuccess) {
      const message = "Cover picture uploaded successfully";
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
          const coverpicture = fileReader.result;
          uploadProfilePicture(coverpicture);
        }
      };
    },
  };

  return (
    <>
      {contextHolder}
      {isLoading ? (
        <div className="absolute bg-gray-100 h-full w-full z-10 opacity-[0.8] rounded-3xl flex justify-center items-center">
          <Spin
            indicator={<Loading3QuartersOutlined spin />}
            size="large"
            className="rounded-full"
          />
        </div>
      ) : null}
      <ImgCrop rotationSlider aspectSlider>
        <Upload {...props}>
          <Button
            shape="circle"
            className="absolute z-10 bottom-4 right-4"
            icon={<FaPencil />}
            size="small"
          ></Button>
        </Upload>
      </ImgCrop>
      <CHImage
        className="w-full !h-full rounded-3xl object-cover object-center"
        src={user?.coverPicture?.url || "/profileAvatar/cover.png"}
        maskClassName="rounded-3xl"
        rootClassName="h-full w-full"
        style={{ height: 100 }}
      />
    </>
  );
};

export default CoverPicture;
