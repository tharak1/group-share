import React, { Fragment, useState } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { GroupContent, UserModel } from '../models/AllModel';
import { format } from 'date-fns';
import uploadImage from '../hooks/fileUpload';
import { serverString } from '../models/ServerString';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { GetUser } from '../redux/UserSlice';

interface UploadFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId:string;
}


const UploadFileModal:React.FC<UploadFileModalProps> = ({isOpen,onClose,groupId}) => {
const user = useSelector(GetUser) as UserModel;
const [loading,setLoading] = useState<boolean>(false);
const [selectedFile,setSelectedFile] = useState<File | null>(null);
const [fileData,setFileData] = useState<GroupContent>({  
  title: '',
  sentBy: '',
  fileAddress: '',
  otherData:'',
  dateSent: '',
});

const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  setLoading(true);
  const formattedDate = format(new Date(), 'dd-MM-yyyy, EEEE - HH:mm');
  const uploadedFile =await uploadImage(selectedFile!,fileData.title,'files');
  const url = `${serverString}/api/user/createFileUploadNow?groupId=${groupId}`;

  const response = await axios.post(url,{...fileData,sentBy:user._id,fileAddress:uploadedFile,dateSent:formattedDate});

  if(response.status === 200){
    setLoading(false);
    onClose();
  }

  setSelectedFile(null);

}

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files && e.target.files[0];
  // Do something with the selected file, like uploading it
  if(file){
    setSelectedFile(file)
  }
};
  return (
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
            <TransitionChild
                as={Fragment}
                enter="ease-out duration-300" 
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center dark:bg-slate-600">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl p-2 text-left align-middle shadow-xl transition-all bg-gray-50 dark:bg-slate-600">
                            <section>
                                <div className="flex flex-col items-center justify-center py-8 mx-auto lg:py-0 dark:bg-slate-600">
                                    <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0 dark:bg-slate-600">
                                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                                <div>
                                                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                                                    <input
                                                        value={fileData.title}
                                                        onChange={(e) => setFileData({...fileData,title:e.target.value})}
                                                        type="text"
                                                        name="title"
                                                        id="title"
                                                        className="border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100"
                                                        required
                                                    />
                                                    <label htmlFor="otherData" className="block mb-2 text-sm font-medium text-gray-900">Message</label>
                                                    <textarea
                                                        value={fileData.otherData}
                                                        onChange={(e) => setFileData({...fileData,otherData:e.target.value})}
                                                        rows={2}
                                                        name="otherData"
                                                        id="otherData"
                                                        className="border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100"
                                                        required
                                                    />

                                                </div>
                                                <div>
                                                    <label htmlFor="categoryImage" className="block mb-2 text-sm font-medium text-gray-900">Category Image</label>
                                                    <input
                                                        onChange={handleFileChange}
                                                        type="file"
                                                        name="categoryImage"
                                                        id="categoryImage"
                                                        className="border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100"
                                                        required
                                                    />
                                                </div>


                                                <button
                                                    type="submit"
                                                    className={`focus:outline-none w-full text-white bg-blue-600 hover:bg-blue-800 outline-0 font-medium rounded-lg text-sm px-5 py-2.5 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    disabled={loading}>
                                                        {
                                                            loading?
                                                            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                                            </svg>:
                                                            "Create"
                                                        }
                                                </button>
                
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </Transition>
  )
}

export default UploadFileModal
