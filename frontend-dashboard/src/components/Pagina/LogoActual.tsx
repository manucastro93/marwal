const LogoActual = (props: { url: string }) => {
    return (
        <div class="card mb-4">
        <div class="card-body">
          <h2 class="card-title">Logo Actual</h2>
          {props.url ? (
            <img src={props.url} alt="Logo Actual" class="img-fluid" />
          ) : (
            <p>No hay logo subido</p>
          )}
        </div>
      </div>
    );
  };
  
  export default LogoActual;