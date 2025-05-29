# Contributing to Little Lemon Restaurant App

Thank you for your interest in contributing to Little Lemon! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/little-lemon.git`
3. Install dependencies: `npm install`
4. Set up Firebase configuration (see README.md)
5. Start development server: `npm start`

### Project Structure
```
src/
├── components/     # Reusable UI components
├── firebase/       # Firebase configuration and services  
├── hooks/          # Custom React hooks
├── navigation/     # Screen navigation setup
├── screens/        # Full-screen components
├── store/          # Zustand state management
└── utils/          # Helper functions
```

## 📝 Development Guidelines

### Code Style
- Use **functional components** with hooks
- Follow **React Native best practices**
- Write **self-documenting code** with clear variable names
- Use **NativeWind classes** for styling
- Keep components **small and focused**

### State Management
- Use **Zustand slices** for related state
- Keep business logic in **custom hooks**
- Use **selectors** for performance optimization
- Follow the established **slice pattern**

### Firebase Integration
- Use the **service layer** for Firebase operations
- Implement proper **error handling**
- Follow **security best practices**
- Test with **Firebase emulators** when possible

## 🧪 Testing

### Testing Requirements
- Write **unit tests** for new components
- Test **custom hooks** thoroughly
- Mock **Firebase dependencies**
- Aim for **>80% code coverage**

### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 📱 UI/UX Guidelines

### Design Principles
- **Mobile-first** responsive design
- **Accessibility** compliance (WCAG 2.1)
- **Consistent** component usage
- **Smooth** animations and transitions

### Component Guidelines
- Use **composition** over inheritance
- Implement **proper prop validation**
- Follow **consistent naming** conventions
- Create **reusable** components

## 🐛 Bug Reports

### Before Submitting
- Check existing issues
- Test on multiple devices/simulators
- Provide minimal reproduction steps

### Bug Report Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [iOS/Android]
- Device: [iPhone 12/Pixel 5]
- App Version: [1.0.0]
```

## ✨ Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of the feature

**Problem it Solves**
What user need does this address

**Proposed Solution**
How should this work

**Alternatives Considered**
Other approaches you've thought about
```

## 📋 Pull Request Process

### Before Submitting
1. **Update your fork** with the latest changes
2. **Create a feature branch** from main
3. **Write/update tests** for your changes
4. **Run the test suite** and ensure all tests pass
5. **Update documentation** if needed

### PR Requirements
- **Clear title** describing the change
- **Detailed description** of what was changed and why
- **Link to related issues** if applicable
- **Screenshots** for UI changes
- **Test coverage** for new code

### Review Process
1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** on multiple platforms
4. **Approval** and merge

## 🎯 Types of Contributions

### Code Contributions
- **Bug fixes**
- **Feature implementations**
- **Performance improvements**
- **Code refactoring**

### Non-Code Contributions
- **Documentation improvements**
- **UI/UX design**
- **Testing and QA**
- **Issue triage**

## 📚 Resources

### Documentation
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Docs](https://firebase.google.com/docs)
- [NativeWind Docs](https://www.nativewind.dev/)

### Community
- [React Native Community](https://github.com/react-native-community)
- [Expo Community](https://github.com/expo/expo)
- [Firebase Community](https://firebase.google.com/community)

## 📞 Questions?

Feel free to reach out if you have questions:
- **Open an issue** for project-related questions
- **Email** [your.email@example.com] for private inquiries
- **Check existing documentation** first

## 🙏 Recognition

All contributors will be acknowledged in the project documentation. Thank you for making Little Lemon better!

---

By contributing, you agree that your contributions will be licensed under the MIT License.
