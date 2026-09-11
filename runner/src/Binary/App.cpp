#include "App.h"
#include "Access.h"
#include "Arg.h"
#include "ArrayAdd.h"
#include "CreateFunc.h"
#include "External.h"
#include "LiteralArray.h"
#include "LiteralBool.h"
#include "LiteralChar.h"
#include "LiteralDouble.h"
#include "LiteralFloat.h"
#include "LiteralInt.h"
#include "LiteralLong.h"
#include "LiteralNull.h"
#include "LiteralString.h"
#include "Not.h"
#include "Operator.h"
#include "Reference.h"
#include "Ternary.h"
#include "Tuple.h"
#include <string>

namespace Binary {
App::App(const char* binary)
{
  Instruction::Register(Access::TypeName, [](const char* binary, int offset) {
    return new Access(binary, offset);
  });
  Instruction::Register(Arg::TypeName, [](const char* binary, int offset) {
    return new Arg(binary, offset);
  });
  Instruction::Register(ArrayAdd::TypeName, [](const char* binary, int offset) {
    return new ArrayAdd(binary, offset);
  });
  Instruction::Register(External::TypeName, [](const char* binary, int offset) {
    return new External(binary, offset);
  });
  Instruction::Register(LiteralArray::TypeName, [](const char* binary, int offset) {
    return new LiteralArray(binary, offset);
  });
  Instruction::Register(LiteralBool::TypeName, [](const char* binary, int offset) {
    return new LiteralBool(binary, offset);
  });
  Instruction::Register(LiteralChar::TypeName, [](const char* binary, int offset) {
    return new LiteralChar(binary, offset);
  });
  Instruction::Register(LiteralDouble::TypeName, [](const char* binary, int offset) {
    return new LiteralDouble(binary, offset);
  });
  Instruction::Register(LiteralFloat::TypeName, [](const char* binary, int offset) {
    return new LiteralFloat(binary, offset);
  });
  Instruction::Register(LiteralInt::TypeName, [](const char* binary, int offset) {
    return new LiteralInt(binary, offset);
  });
  Instruction::Register(LiteralLong::TypeName, [](const char* binary, int offset) {
    return new LiteralLong(binary, offset);
  });
  Instruction::Register(LiteralNull::TypeName, [](const char* binary, int offset) {
    return new LiteralNull(binary, offset);
  });
  Instruction::Register(LiteralString::TypeName, [](const char* binary, int offset) {
    return new LiteralString(binary, offset);
  });
  Instruction::Register(Not::TypeName, [](const char* binary, int offset) {
    return new Not(binary, offset);
  });
  Instruction::Register(Operator::TypeName, [](const char* binary, int offset) {
    return new Operator(binary, offset);
  });
  Instruction::Register(Reference::TypeName, [](const char* binary, int offset) {
    return new Reference(binary, offset);
  });
  Instruction::Register(Ternary::TypeName, [](const char* binary, int offset) {
    return new Ternary(binary, offset);
  });
  Instruction::Register(Tuple::TypeName, [](const char* binary, int offset) {
    return new Tuple(binary, offset);
  });

  this->functions = std::vector<CreateFunc*>();
  auto offset = 0;
  while (binary[offset] != 0) {
    auto func = new CreateFunc(binary, offset + 1);
    this->functions.push_back(func);
    offset = func->get_end();
  }
}

App::~App()
{
  for (const auto& func : this->functions) {
    delete func;
  }
}

CreateFunc* App::find(std::string name)
{
  for (const auto& func : this->functions) {
    if (func->get_name().compare(name)) {
      return func;
    }
  }

  throw "Func not found";
}
}
