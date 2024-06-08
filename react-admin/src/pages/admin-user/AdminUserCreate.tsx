import React, {useState} from "react";
import {Link, useParams} from "react-router-dom";
import InputField from "../../components/InputField";
import {Switch} from "@headlessui/react";
import AvoRedMultiSelectField from "../../components/AvoRedMultiSelectField";
import _ from "lodash";
import {useGetAdminUser} from "./hooks/useGetAdminUser";
import {useGetRoleOptions} from "./hooks/useGetRoleOptions";
import {useUpdateAdminUser} from "./hooks/useUpdateAdminUser";
import {useTranslation} from "react-i18next";
import {Controller, useForm} from "react-hook-form";
import {joiResolver} from "@hookform/resolvers/joi";
import {AdminUserEditSchema} from "./schemas/admin.user.edit.schema";
import IAdminUserCreate from "../../types/admin-user/IAdminUserCreate";
import {useStoreAdminUser} from "./hooks/useStoreAdminUser";
import {AdminUserCreateSchema} from "./schemas/admin.user.create.schema";

function AdminUserCreate() {
    const [selectedOption, setSelectedOption] = useState([]);
    const params = useParams();
    const [t] = useTranslation("global")


    const {
        control,
        trigger,
        register,
        handleSubmit,
        formState: {errors},
        setValue
    } = useForm<IAdminUserCreate>({
        resolver: joiResolver(AdminUserCreateSchema, {allowUnknown: true})
    })

    const roleOptionResult = useGetRoleOptions();
    const {mutate} = useStoreAdminUser()

    const roles = _.get(roleOptionResult, "data.data.options", []);


    const isSuperAdminSwitchOnChange = ((e: boolean) => {
        if (!e) {
            setSelectedOption([])
        }
        setValue("is_super_admin", e)
        trigger('is_super_admin')
    })

    const submitHandler = async (data: IAdminUserCreate) => {
        data.role_ids = selectedOption;
        (typeof data.profile_image === 'object') ? data.image = data.profile_image[0]: delete data.image
        mutate(data);
    };

    return (
        <div className="flex-1 bg-white">
            <div className="px-5 pl-64">
                <div className="w-full">
                    <div className="block rounded-lg p-6">
                        <h1 className="text-xl font-semibold mb-4 text-gray-900">
                            {t("admin_user.information")}
                        </h1>
                        <form onSubmit={handleSubmit(submitHandler)}>
                            <div className="mb-4">
                                <InputField
                                    label={t("common.full_name")}
                                    type="text"
                                    name="full_name"
                                    register={register("full_name")}
                                    autoFocus
                                />
                            </div>
                            <div className="mb-4">
                                <InputField
                                    label={t("common.email")}
                                    type="text"
                                    name="email"
                                    register={register("email")}
                                />
                            </div>

                            <div className="mb-4">
                                <InputField
                                    label={t("password")}
                                    type="password"
                                    name="password"
                                    register={register("password")}
                                    autoFocus
                                />
                            </div>
                            <div className="mb-4">
                                <InputField
                                    label={t("confirmation_password")}
                                    type="password"
                                    name="confirmation_password"
                                    register={register("confirmation_password")}
                                    autoFocus
                                />
                            </div>

                            <Controller
                                control={control}
                                name="is_super_admin"
                                render={({field}) => {
                                    return (
                                        <>
                                            <div className="mb-4 flex items-center">
                                                <label
                                                    htmlFor="is_super_admin_switch"
                                                    className="text-sm text-gray-600"
                                                >
                                                    Is Super Admin
                                                </label>

                                                <Switch
                                                    onChange={e => isSuperAdminSwitchOnChange(e)}
                                                    checked={field.value}
                                                    id="is_super_admin_switch"
                                                    className={`${
                                                        field.value ? "bg-primary-500" : "bg-gray-200"
                                                    } relative ml-5 inline-flex h-6 w-11 items-center rounded-full`}
                                                >
                                                    <span className="sr-only">Enable notifications</span>
                                                    <span
                                                        className={`${
                                                            field.value ? "translate-x-6" : "translate-x-1"
                                                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                                    />
                                                </Switch>
                                            </div>
                                            {(!field.value) ?
                                                <div className="mb-4">
                                                    <div className="relative z-10">
                                                        <AvoRedMultiSelectField
                                                            label="Roles"
                                                            options={roles}
                                                            selectedOption={selectedOption}
                                                            onChangeSelectedOption={setSelectedOption}
                                                        ></AvoRedMultiSelectField>
                                                    </div>
                                                </div>
                                                : <></>}

                                        </>
                                    )
                                }}
                            />

                            <div className="flex items-center mt-3">
                                <div className="mb-4">
                                    <InputField
                                        label="Profile Photo"
                                        accept="image/*"
                                        type="file"
                                        name="profile_image"
                                        register={register("profile_image")}
                                    />
                                </div>

                            </div>
                            <div className="flex items-center mt-5">
                                <button
                                    type="submit"
                                    className="bg-primary-600 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    {t("common.save")}
                                </button>
                                <Link
                                    to="/admin/admin-user"
                                    className="ml-auto font-medium text-gray-600 hover:text-gray-500"
                                >
                                    {t("common.cancel")}
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminUserCreate;
