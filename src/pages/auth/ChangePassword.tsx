import AuthLayout from "../../components/AuthLayout";
import Button from "../../components/Button";
import FormHeader from "../../components/FormHeader";
import Input from "../../components/Input";
import { RiLockPasswordFill } from "react-icons/ri";

const ChangePassword = () => {
    return (
        <AuthLayout>
            <FormHeader title="Change Password" variant="secondary"/>
                <Input
                    label="Enter your new password"
                    icon={RiLockPasswordFill}
                    type="password"
                    variant="secondary"
                    iconVariant="secondary"
                    placeholder="••••••••"
                    required
                />
                <Input
                    label="Enter your new password again"
                    icon={RiLockPasswordFill}
                    type="password"
                    variant="secondary"
                    iconVariant="secondary"
                    placeholder="••••••••"
                    required
                />
                <Button
                    text="Confirm"
                    type="submit"
                    variant="secondary"
                    loading={false}
                />
        </AuthLayout>
    );
}
export default ChangePassword;