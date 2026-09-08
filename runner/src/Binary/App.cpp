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

namespace Binary
{
  App::App(char *binary)
  {
    Instruction::Register(0, [](char *binary, int offset)
                          { return (Instruction *)new Access(binary, offset); });
    Instruction::Register(1, [](char *binary, int offset)
                          { return (Instruction *)new Arg(binary, offset); });
    Instruction::Register(2, [](char *binary, int offset)
                          { return (Instruction *)new ArrayAdd(binary, offset); });
    Instruction::Register(3, [](char *binary, int offset)
                          { return (Instruction *)new External(binary, offset); });
    Instruction::Register(4, [](char *binary, int offset)
                          { return (Instruction *)new LiteralArray(binary, offset); });
    Instruction::Register(5, [](char *binary, int offset)
                          { return (Instruction *)new LiteralBool(binary, offset); });
    Instruction::Register(6, [](char *binary, int offset)
                          { return (Instruction *)new LiteralChar(binary, offset); });
    Instruction::Register(7, [](char *binary, int offset)
                          { return (Instruction *)new LiteralDouble(binary, offset); });
    Instruction::Register(8, [](char *binary, int offset)
                          { return (Instruction *)new LiteralFloat(binary, offset); });
    Instruction::Register(9, [](char *binary, int offset)
                          { return (Instruction *)new LiteralLong(binary, offset); });
    Instruction::Register(10, [](char *binary, int offset)
                          { return (Instruction *)new LiteralNull(binary, offset); });
    Instruction::Register(11, [](char *binary, int offset)
                          { return (Instruction *)new LiteralString(binary, offset); });
    Instruction::Register(12, [](char *binary, int offset)
                          { return (Instruction *)new Not(binary, offset); });
    Instruction::Register(13, [](char *binary, int offset)
                          { return (Instruction *)new Operator(binary, offset); });
    Instruction::Register(14, [](char *binary, int offset)
                          { return (Instruction *)new Reference(binary, offset); });
    Instruction::Register(15, [](char *binary, int offset)
                          { return (Instruction *)new Ternary(binary, offset); });
    Instruction::Register(16, [](char *binary, int offset)
                          { return (Instruction *)new Tuple(binary, offset); });

    this->functions = new List<CreateFunc *>();
    auto offset = 0;
    while (binary[offset] != 0)
    {
      this->functions->push(new CreateFunc(binary, offset + 1));
    }
  }
}