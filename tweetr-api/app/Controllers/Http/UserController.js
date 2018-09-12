'use strict'

const User = use('App/Models/User')
const Tweet = use('App/Models/Tweet')
const Hash = use('Hash')

class UserController {

  async signup ({ request, auth, response }) {

    // collect data from signup-form
    const userData = request.only(['name', 'username', 'email', 'password'])

    try {

      const user = await User.create(userData)
      const token = await auth.generate(user)

      return response.json({
        status: 'success',
        data: token
      })
    }
    catch (error) {

      return response.status(400).json({
        status: 'error',
        message: 'User creation error!'
      })
    }
  }

  async login ({ request, auth, response }) {

    try {
      const token = await auth.attempt(
        request.input('email'),
        request.input('password')
      )

      return response.json({
        status: 'success',
        data: token
      })

    } catch (error) {

      return response.status('400').json({
        status: 'error',
        message: 'Email / Password Invalid!'
      })

    }
  }

  async changePassword ({ request, auth, response }) {

    const user = auth.current.user

    const verifyPassword = await Hash. verify(
      request.input('password'),
      user.password
    )

    if (!verifyPassword) {

      return response.status(400).json({
        status: 'error',
        message: 'Your password could not be verified!'
      })
    }

    user.password = await Hash.make(request.input('newPassword'))
    await user.save()

    return response.json({
      status: 'success',
      message: 'Password updated!'
    })

  }

  async me ({ auth, response }) {

    const User = await User.query()
      .where('id', auth.current.user.id)
      .with('tweets', builder => {
        builder.with('user')
        builder.with('favorites')
        builder.with('replies')
      })
      .with('following')
      .with('followers')
      .with('favorites')
      .with('favorites.tweet', builder => {
        builder.with('user')
        builder.with('favorites')
        builder.with('replies')
      })
      .firstOrFail()

    return response.json({
      status: 'success',
      data: user
    })
  }

  async updateProfile ({ request, auth, response }) {

    try {

      const user = auth.current.user

      user.name = request.input('name')
      user.username = request.input('username')
      user.email = request.input('email')
      user.location = request.input('location')
      user.bio = request.input('bio')
      user.website_url = request.input('website_url')

      await user.save()

      return response.json({
        status: 'success',
        message: 'Profile updated',
        data: user
      })

    } catch (error) {

      return response.status(400).json({
        status: 'error',
        message: 'There was a problem while trying to update your profile :('
      })

    }

  }

  async showProfile ({ request, params, response }) {

    try {
      const user = await User.query()
        .where('username', params.username)
        .with('tweets', builder => {
          builder.with('user')
          builder.with('favorites')
          builder.with('replies')
        })
        .with('following')
        .with('followers')
        .with('favorites')
        .with('favorites.tweet', builder => {
          builder.with('user')
          builder.with('favorites')
          builder.with('replies')
        })
        .firstOrFail()

      return response.json({
        status: 'success',
        data: user
      })
    }
    catch (error) {

      return response.status(404),json({
        status: 'error',
        message: 'User not found'
      })
    }
  }

  async timeline ({ auth, response }) {

    const user = await User.find(auth.current.user.id)

    const followersIds = await user.following().ids()

    followersIds.push(user.id)

    const tweets = await Tweet.query()
      .whereIn('user_id', followersIds)
      .with('user')
      .with('favorites')
      .with('replies')
      .fetch()

      return response.json({
        status: 'success',
        data: tweets
      })

  }

  async usersToFollow ({ params, auth, response }) {

    const user = auth.current.user
    const usersAlreadyFollowing = await user.following().ids()

    const usersToFollow = await User.query()
      .whereNot('id', user.id)
      .whereNotIn('id', usersAlreadyFollowing)
      .pick(3)

      return response.json({
        status: 'success',
        data: usersToFollow
      })

  }

  async follow ({ request, auth, response }) {

    const user = auth.current.user

    await user.following().attach(request.input('user_id'))

    return response.json({
      status: 'success',
      data: null
    })
  }

  async unFollow ({ params, auth, response }) {

    const user = auth.current.user

    await user.following().detach(params.id)

    return response.json({
      status: 'success',
      data: null
    })
  }

}

module.exports = UserController
