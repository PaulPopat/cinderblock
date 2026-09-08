#include "./App.h"
#include "./Access.h"
#include "./Arg.h"
#include "./ArrayAdd.h"
#include "./CreateFunc.h"
#include "./External.h"
#include "./LiteralArray.h"
#include "./LiteralBool.h"
#include "./LiteralChar.h"
#include "./LiteralDouble.h"
#include "./LiteralFloat.h"
#include "./LiteralInt.h"
#include "./LiteralLong.h"
#include "./LiteralNull.h"
#include "./LiteralString.h"
#include "./Not.h"
#include "./Operator.h"
#include "./Reference.h"
#include "./Ternary.h"
#include "./Tuple.h"

#include "../Core/alloc.h"
#include "../Core/List.h"

namespace Binary
{
  App::App(char *binary)
  {
    Instruction::Register(Access::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new Access(binary, offset); });
    Instruction::Register(Arg::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new Arg(binary, offset); });
    Instruction::Register(ArrayAdd::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new ArrayAdd(binary, offset); });
    Instruction::Register(External::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new External(binary, offset); });
    Instruction::Register(LiteralArray::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new LiteralArray(binary, offset); });
    Instruction::Register(LiteralBool::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new LiteralBool(binary, offset); });
    Instruction::Register(LiteralChar::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new LiteralChar(binary, offset); });
    Instruction::Register(LiteralDouble::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new LiteralDouble(binary, offset); });
    Instruction::Register(LiteralFloat::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new LiteralFloat(binary, offset); });
    Instruction::Register(LiteralInt::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new LiteralInt(binary, offset); });
    Instruction::Register(LiteralLong::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new LiteralLong(binary, offset); });
    Instruction::Register(LiteralNull::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new LiteralNull(binary, offset); });
    Instruction::Register(LiteralString::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new LiteralString(binary, offset); });
    Instruction::Register(Not::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new Not(binary, offset); });
    Instruction::Register(Operator::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new Operator(binary, offset); });
    Instruction::Register(Reference::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new Reference(binary, offset); });
    Instruction::Register(Ternary::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new Ternary(binary, offset); });
    Instruction::Register(Tuple::TypeName, [](char *binary, int offset)
                          { return (Instruction *)new Tuple(binary, offset); });

    this->functions = new Core::List<CreateFunc *>();
    auto offset = 0;
    while (binary[offset] != 0)
    {
      this->functions->push(new CreateFunc(binary, offset + 1));
    }

    Core::loaded_binary();
  }
}