import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import SignUpForm from '@/components/Auth/SignUpForm'
import LogInForm from '@/components/Auth/LogInForm'
import UserProfileSettings from '@/components/User/Settings/UserProfileSettings'
import UserPasswordSettings from '@/components/User/Settings/UserPasswordSettings'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: '', component: Home },
    { path: '/signup', name: 'Sign Up Form', component: SignUpForm },
    { path: '/login', name: 'Log In Form', component: LogInForm },
    { path: '/settings/profile', name: 'Profile Settings', component: UserProfileSettings },
    { path: '/settings/password', name: 'Profile Password Settings', component: UserPasswordSettings }
  ]
})
