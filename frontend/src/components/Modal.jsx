function Modal({ children }) {
    return (
        <div className='fixed inset-0 z-50 bg-background justify-center w-full h-full'>
            {children}
        </div>
    )
}

export default Modal