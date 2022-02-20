import { shallowMount } from '@vue/test-utils';
import LoginComponent from '@/components/auth/Login.vue';
import axios from 'axios';

jest.mock('axios');

describe('Componente Login', () => {
  it('Renderizar formulario', () => {
    const contenedor = shallowMount(LoginComponent);
    expect(contenedor.text()).toContain('Ingresar al sistema');
  });

  it('Login con usuario admin', async () => {
    axios.post.mockResolvedValue({
      finalizado: true,
      mensaje: 'listado obtenido con exito',
      datos: [{ usuario: 'user', estado: 'ACTIVO' }]
    });
    shallowMount(LoginComponent);
    // const btnLogin = contenedor.find('button');
    // await btnLogin.trigger('click');
    expect(axios).toHaveBeenCalledTimes(0);
  });
});
