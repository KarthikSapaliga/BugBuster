function Modal({ children }) {
    return (
        <div className='fixed inset-0 z-50 bg-transparent justify-center w-full h-full'>
            {children}
        </div>
    )
}

export default Modal