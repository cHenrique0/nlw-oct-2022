import Image from "next/image";

// Images
import mobileAppPreviewImg from "../assets/mobile-preview-nlw-copa.png";
import logoImg from "../assets/logo.svg";
import avatarExampleImg from "../assets/avatares.png";
import iconCheckImg from "../assets/icon-check.svg";

/* interface HomeProps {
  count: number;
} */

export default function Home() {
  return (
    <div>
      <main>
        <Image src={logoImg} alt="NLW Copa" />

        <h1>Crie seu bolão e compartilhe entre amigos</h1>

        <div>
          <Image src={avatarExampleImg} alt="" />
          <strong>
            <span>+12.592</span> pessoas já estão usando
          </strong>
        </div>

        <form>
          <input type="text" placeholder="Qual o nome do seu bolão?" />
          <button type="submit">Criar meu bolão</button>
        </form>

        <p>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </p>

        <div>
          <div>
            <Image src={iconCheckImg} alt="" />
            <div>
              <span>+2.034</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div>
            <Image src={iconCheckImg} alt="" />
            <div>
              <span>+10.493</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={mobileAppPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação móvel no NLW Copa"
        quality={100}
      />
    </div>
  );
}

// Backend (API) request
/* export const getServerSideProps = async () => {
  const response = await fetch("http://localhost:3333/pools/count");
  const data = await response.json();

  return {
    props: {
      count: data.count,
    },
  };
}; */
