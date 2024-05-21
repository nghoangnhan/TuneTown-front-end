
import useUserUtils from '../../utils/useUserUtils';
import { useEffect, useState } from 'react';
import { Checkbox, Form, message } from 'antd';
import useConfig from '../../utils/useConfig';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setRefershAccount } from '../../redux/slice/account';
import PropTypes from 'prop-types';

const EditGenreForm = ({ setOpenModalEditGenre }) => {
    const { getAllGenres } = useUserUtils();
    const { Base_URL, auth } = useConfig();
    const dispatch = useDispatch();
    const refreshAccount = useSelector((state) => state.account.refreshAccount);
    const [genres, setGenres] = useState([]);
    const [form] = Form.useForm();


    const updatedGenres = async (values) => {
        try {
            const response = await axios.put(`${Base_URL}/users/modify-favorite-genres`, values
                , {
                    headers: {
                        Authorization: `Bearer ${auth.access_token}`,
                    },
                });
            console.log(response.data, response.status);
            if (response.status === 200) {
                dispatch(setRefershAccount(true));
                message.success("Genres updated successfully", 2);
            }
            return response.data;
        } catch (error) {
            console.error("Error edited user:", error.message);
        }
    }

    const onFinish = (values) => {
        if (!values.genre) {
            message.error("Please choose at least one genre!", 2);
            return;
        }
        const genreList = values.genre.map((id) => {
            console.log("ID:", id);
            return {
                id: id
            }
        });
        console.log("Genre List:", genreList);
        updatedGenres(genreList);
        setOpenModalEditGenre(false);
    }

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    }

    useEffect(() => {
        getAllGenres().then((res) => {
            dispatch(setRefershAccount(false));
            setGenres(res);
        })
    }, []);

    useEffect(() => {
        if (refreshAccount) {
            getAllGenres().then((res) => {
                setGenres(res);
            })
        }
    }, [refreshAccount]);

    return (
        <div className="flex items-center justify-center">
            <Form
                form={form}

                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className='flex flex-col justify-center w-full h-full rounded-md formStyle'
            >
                <div className="w-full mb-5 text-center">
                    <h1 className="text-3xl font-bold uppercase font-monserrat text-primary dark:text-primaryDarkmode">
                        Edit Genre
                    </h1>
                </div>

                <Form.Item
                    label=" Genres"
                    name="genre"
                    rules={[{ required: true, message: "Please input your genre!" }]}
                    className='flex justify-center mt-4 '
                >
                    <Checkbox.Group className='grid items-center grid-cols-3 gap-8'>
                        {genres.map((genre, index) => (
                            <Checkbox key={index} className='text-primaryText2 dark:text-primaryTextDark2' value={genre.id}>{genre.genreName}</Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item
                    wrapperCol={{ offset: 8, span: 16 }}>
                    <button type="submit" className="w-1/4 h-10 border rounded-md text-primary dark:text-primaryDarkmode border-primary dark:border-primaryDarkmode hover:opacity-70">Submit</button>
                </Form.Item>
            </Form>
        </div>
    );
};

EditGenreForm.propTypes = {
    setOpenModalEditGenre: PropTypes.func,
};

export default EditGenreForm;