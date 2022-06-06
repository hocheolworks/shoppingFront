import axios, { AxiosError } from 'axios';
import { useRef, useState, useMemo, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { API_BASE_URL } from '../../utils/constants/url';
import ReactQuill from 'react-quill';
import { FileInQuill } from '../../types/types';
import { useDispatch, useSelector } from 'react-redux';
import { AppStateType } from '../../redux/reducers/root-reducer';
import {
  clearAddProductEditor,
  setProductContent,
  pushProductImage,
} from '../../redux/actions/admin-actions';

const ReactQuillWrapper = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');

    return function comp({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false, loading: () => <p>Loading ...</p> }
);

const EditorComponent = ({ contentsProp = '' }) => {
  const dispatch = useDispatch();
  const QuillRef = useRef<ReactQuill>();
  const isMounted = useRef<boolean>(false);

  useEffect(() => {
    if (!isMounted.current) {
      dispatch(clearAddProductEditor());
      if (contentsProp) {
        setContents(contentsProp);
      }
      isMounted.current = true;
    }
  }, []);

  const [contents, setContents] = useState('');
  const [timer, setTimer] = useState<NodeJS.Timeout>(); // 디바운싱 타이머

  const onChangeHandler = (value: string) => {
    setContents(value);

    // 디바운싱
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      dispatch(setProductContent(value));
    }, 800);
    setTimer(newTimer);
  };

  // 이미지를 업로드 하기 위한 함수
  const imageHandler = () => {
    // 파일을 업로드 하기 위한 input 태그 생성
    const input = window.document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    // 파일이 input 태그에 담기면 실행 될 함수
    input.onchange = async (event: any) => {
      const file: string | Blob = event.target.files[0];

      const fileReader = new FileReader();
      fileReader.onload = function (event: any) {
        const baseData: string = event.target.result;

        QuillRef.current
          ?.getEditor()
          .insertEmbed(
            QuillRef.current.getEditor().getSelection()?.index as number,
            'image',
            baseData
          );
        const newImage: FileInQuill = { base64: baseData, file: file };
        dispatch(pushProductImage(newImage));
      };
      fileReader.readAsDataURL(file as Blob);
    };
  };

  // quill에서 사용할 모듈을 설정하는 코드 입니다.
  // 원하는 설정을 사용하면 되는데, 저는 아래와 같이 사용했습니다.
  // useMemo를 사용하지 않으면, 키를 입력할 때마다, imageHandler 때문에 focus가 계속 풀리게 됩니다.
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ size: ['small', false, 'large', 'huge'] }, { color: [] }],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
            { align: [] },
          ],
          ['image', 'video'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  return (
    <>
      <ReactQuillWrapper
        forwardedRef={QuillRef}
        style={{ minHeight: '480px' }}
        value={contents}
        onChange={onChangeHandler}
        modules={modules}
        theme="snow"
        placeholder="내용을 입력해주세요."
      />
    </>
  );
};

export default EditorComponent;
