import Vue from 'vue'
import Router from 'vue-router'

import SignUpForm from '@/components/Auth/SignUpForm'
import LogInForm from '@/components/Auth/LogInForm'
import UserProfileSettings from '@/components/User/Settings/UserProfileSettings'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/signup', name: 'Sign Up Form', component: SignUpForm },
    { path: '/login', name: 'Log In Form', component: LogInForm },
    { path: '/settings/profile', name: 'Profile Settings', component: UserProfileSettings }
  ]
})
