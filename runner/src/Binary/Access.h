#include "./Instruction.h"
#include "./LiteralString.h"

namespace Binary
{
  class Access : Instruction
  {
  public:
    const static int TypeName = 0;
    Access(char *binary, int offset);
    const int get_end() const;

  private:
    Instruction *subject;
    LiteralString *key;
    int end;
  };
}