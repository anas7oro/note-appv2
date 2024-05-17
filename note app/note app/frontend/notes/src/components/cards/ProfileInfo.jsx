import React from 'react';

const ProfileInfo = ({ onLogout, userInfo }) => {
    return (
        <div className='flex items-center gap-3'>
            {userInfo && ( // Conditional rendering to check if userInfo is not null
                <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>
                    {userInfo.name}
                </div>
            )}

            <div>
                {userInfo && ( // Conditional rendering to check if userInfo is not null
                    <>
                        <p className='text-sm font-medium'>{userInfo.name}</p>
                        <button className='text-sm text-slate-700 underline' onClick={onLogout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileInfo;
