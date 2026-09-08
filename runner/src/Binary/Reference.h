#include "./Instruction.h"
#include "./LiteralString.h"

namespace Binary
{
  class Reference : Instruction
  {
  public:
    const static int TypeName = 15;
    Reference(char *binary, int offset);
    const int get_end() const;

  private:
    LiteralString *name;
    int end;
  };
}