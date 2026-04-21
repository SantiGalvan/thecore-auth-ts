interface ErrorPageProps {
    errorMessage?: string;
    errorShow?: boolean;
}

const ErrorPage = ({ errorMessage, errorShow }: ErrorPageProps) => {
    return (
        <section className={errorShow ? '' : 'hidden'}>
            <div className="container mx-auto">
                <h1 className="text-center text-8xl my-12">Errore</h1>
                <pre className="text-xl">
                    {errorMessage}
                </pre>
            </div>
        </section>
    );
};

export default ErrorPage;
