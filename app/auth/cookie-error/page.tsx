export default function CookieErrorPage() {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Cookies Necessários</h1>
        <p className="mb-4">
          Para continuar usando nossa plataforma, por favor:
        </p>
        <ol className="list-decimal list-inside mb-4">
          <li className="mb-2">Abra as configurações do seu navegador</li>
          <li className="mb-2">Procure por Configurações de cookies</li>
          <li className="mb-2">Permita cookies de terceiros</li>
          <li className="mb-2">Recarregue a página</li>
        </ol>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Já habilitei os cookies
        </button>
      </div>
    );
  }