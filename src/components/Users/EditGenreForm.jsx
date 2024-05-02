
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

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

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
        <div>
            <Form
                form={form}
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className='p-4 rounded-md text-primaryText2 bg-backgroundComponentPrimary'
            >
                <div className="flex flex-col items-center justify-center mt-2">
                    <h1 className="text-2xl font-bold">Edit Genre</h1>
                </div>

                <Form.Item
                    label="Favourite Genre"
                    name="genre"
                    rules={[{ required: true, message: "Please input your genre!" }]}
                    className='mt-4'
                >
                    <Checkbox.Group>
                        {genres.map((genre, index) => (
                            <Checkbox key={index} value={genre.id}>{genre.genreName}</Checkbox>
                        ))}
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item
                    wrapperCol={{ offset: 8, span: 16 }}>
                    <button type="submit" className="w-1/4 h-10 text-white rounded-md bg-primary dark:text-primaryDarkmode hover:opacity-70">Submit</button>
                </Form.Item>
            </Form>
        </div>
    );
};

EditGenreForm.propTypes = {
    setOpenModalEditGenre: PropTypes.func,
};

export default EditGenreForm;