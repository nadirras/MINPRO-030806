async loginAccount(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findFirst({
        where: { email },
      });
  
      if (!user) {
        throw 'User not found!';
      }
  
      const isValidPass = await compare(password, user.password);
      if (!isValidPass) {
        throw 'Wrong Password!';
      }
  
      // Check if user is activated
      if (!user.activation) {
        throw 'Account not activated! Please verify your account.';
      }
  
      // If user is activated, generate JWT token
      const payload = {
        id: user.id,
      };
      const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1d' });
  
      res.status(200).send({
        status: 'OK',
        user,
        token,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        message: err,
      });
    }
  }
  