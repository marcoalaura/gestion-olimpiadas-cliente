import { shallowMount } from '@vue/test-utils';
import Login from '@/components/auth/Login.vue';

describe('HelloWorld.vue', () => {
  it('Test de prueba con el Login', () => {
    const wrapper = shallowMount(Login);
    expect(wrapper.text()).toContain('Ingresar al sistema');
  });
});
